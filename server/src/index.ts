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
        const { commitMessage, customPrompt } = req.body;

        // 1. 커밋 메시지가 없으면 에러
        if (!commitMessage) {
            return res
                .status(400)
                .json({ error: "No commit message provided" });
        }

        // 2. [수정] '안내 문구(Instruction)' 결정
        // 클라이언트가 보낸 커스텀 프롬프트가 있으면 그걸 쓰고, 없으면 백엔드 기본값을 씁니다.
        const instructions =
            customPrompt ||
            `You are a helpful programming assistant.
       Summarize the following GitHub commit message concisely.
       Respond in 1-2 sentences.`;

        // 3. [핵심 수정] 안내 문구와 커밋 메시지를 '무조건' 결합합니다.
        // 이전에는 이 결합 로직이 조건문에 따라 누락되는 경우가 있었습니다.
        const finalPrompt = `
      ${instructions}

      Here is the Commit Message to summarize:
      """
      ${commitMessage}
      """
    `;

        console.log("[Server] /api/summarize: Gemini에게 요청 보냄...");

        // (디버깅용) 실제 Gemini로 나가는 프롬프트 확인
        // console.log(finalPrompt);

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
