import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

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
        "[Server] ⚠️ GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다. /api/summarize 엔드포인트가 작동하지 않습니다."
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
        // 1. React가 보낸 커밋 메시지를 받습니다.
        const { commitMessage } = req.body;

        if (!commitMessage) {
            return res
                .status(400)
                .json({ error: "No commit message provided" });
        }

        // 2. 프롬프트 엔지니어링
        const prompt = `
      You are a helpful programming assistant.
      Summarize the following GitHub commit message concisely, focusing on the main action and purpose.
      Respond in 1-2 sentences. Keep the summary technical but clear.
      
      Commit Message:
      """
      ${commitMessage}
      """
      
      Summary:
    `;

        console.log("[Server] /api/summarize: Gemini API 요청 중...");

        // 3. Gemini API 호출
        const result = await model.generateContent(prompt);
        const response = result.response;
        const summary = response.text();

        console.log("[Server] /api/summarize: Gemini API 응답 성공.");

        // 4. React에 요약된 텍스트를 응답으로 보냅니다.
        res.status(200).json({ summary: summary });
    } catch (error) {
        console.error("[Server] /api/summarize: Gemini API 요청 실패:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

app.listen(port, () => {
    console.log(
        `[Server] Express 서버가 http://localhost:${port} 에서 실행 중입니다.`
    );
});
