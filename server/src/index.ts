import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// 테스트용 API 엔드포인트
app.get("/api/test", (req: Request, res: Response) => {
    console.log("[/api/test] - React에서 요청이 왔습니다!");
    res.json({ message: "안녕하세요! Express 서버에서 보낸 응답입니다." });
});

// 1주차: GitHub 프록시 엔드포인트
// client한테 받은 repository 주소를 받고 Github API로 데이터 요청
app.post("/api/github", async (req: Request, res: Response) => {
    const { owner, repo } = req.body;

    if (!owner || !repo) {
        return res
            .status(400)
            .json({ error: "owner와 repo 이름이 필요합니다." });
    }

    const graphqlQuery = {
        query: `
      query GetCommits($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  edges {
                    node {
                      oid   # 고유 ID(커밋 해시) 추가
                      messageHeadline
                      committedDate
                      author {
                        name
                        email
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
        variables: { owner, repo },
    };

    // 토큰 보관
    const token = process.env.GITHUB_TOKEN;
    const githubApiUrl = "https://api.github.com/graphql";

    console.log(`[Server] /api/github: ${owner}/${repo}의 데이터 요청 중...`);

    try {
        // Github API로 데이터 요청 (axios 사용)
        const response = await axios.post(
            githubApiUrl,
            graphqlQuery, // 객체 그대로 전달
            {
                headers: {
                    Authorization: `Bearer ${token}`, // .env의 토큰 사용
                    "Content-Type": "application/json",
                },
            }
        );

        // 7. Github한테 받은 데이터를 client로 전달
        console.log(
            "[Server] /api/github: GitHub로부터 응답 받음. Client로 전달."
        );
        res.status(200).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "[Server] /api/github: Axios 에러:",
                error.response?.data || error.message
            );
        } else {
            console.error("[Server] /api/github: GitHub API 요청 실패:", error);
        }

        res.status(500).json({
            error: "GitHub API 요청 중 오류가 발생했습니다.",
        });
    }
});

// 2주차 서버 구현
// Gemini API 클라이언트 초기화
const geminiApiKey = process.env.GEMINI_API_KEY || "";
if (!geminiApiKey) {
    console.warn(
        "[Server] GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. /api/summarize 엔드포인트가 작동하지 않습니다."
    );
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post("/api/summarize", async (req: Request, res: Response) => {
    if (!geminiApiKey) {
        return res
            .status(500)
            .json({ error: "Gemini API 키가 설정되지 않았습니다." });
    }

    try {
        // 1. [수정] sha(oid), owner, repo를 추가로 받습니다.
        const { commitMessage, customPrompt, sha, owner, repo } = req.body;

        if (!commitMessage || !sha || !owner || !repo) {
            return res
                .status(400)
                .json({ error: "Missing required fields (sha, owner, repo)" });
        }

        // 2. [추가] GitHub API로 해당 커밋의 상세 내용(Diff)을 가져옵니다.
        console.log(`[Server] GitHub Diff 요청: ${owner}/${repo}/${sha}`);

        let codeDiff = "";
        try {
            const commitDetailUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
            const githubResponse = await axios.get(commitDetailUrl, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            // 3. [추가] 변경된 파일들의 코드 조각(patch)을 추출하여 합칩니다.
            const files = githubResponse.data.files || [];

            // 토큰 절약을 위해 최대 5개 파일, 파일당 2000자까지만 가져옵니다.
            for (const file of files.slice(0, 5)) {
                if (file.patch) {
                    codeDiff += `\n--- File: ${file.filename} ---\n`;
                    // 너무 긴 코드는 자릅니다.
                    codeDiff +=
                        file.patch.length > 2000
                            ? file.patch.slice(0, 2000) + "\n...(truncated)..."
                            : file.patch;
                }
            }
            if (files.length > 5) {
                codeDiff += `\n...(and ${files.length - 5} more files)...`;
            }
        } catch (ghError) {
            console.error(
                "[Server] GitHub Diff 가져오기 실패 (요약은 계속 진행):",
                ghError
            );
            codeDiff = "Could not retrieve code changes (Diff).";
        }

        // 4. [수정] 프롬프트에 Diff 내용을 포함시킵니다.
        const instructions =
            customPrompt ||
            `You are a helpful programming assistant.
       Analyze the provided commit message and the code diff.
       Summarize the changes concisely in a technical blog post style.
       Focus on *what* changed in the code and *why*.
       Respond in 1-2 sentences.`;

        const finalPrompt = `
      ${instructions}

      [Commit Message]
      """
      ${commitMessage}
      """

      [Code Changes (Diff)]
      """
      ${codeDiff || "No code changes available."}
      """
    `;

        console.log("[Server] Gemini에게 Diff 포함 요청 전송...");

        const result = await model.generateContent(finalPrompt);
        const response = result.response;
        const summary = response.text();

        console.log("[Server] /api/summarize: 응답 성공");
        res.status(200).json({ summary: summary });
    } catch (error) {
        console.error("[Server] /api/summarize: 요청 실패:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

app.listen(port, () => {
    console.log(
        `[Server] Express 서버가 http://localhost:${port} 에서 실행 중입니다.`
    );
});
