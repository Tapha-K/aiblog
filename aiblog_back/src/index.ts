import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
    cors({
        origin: "http://localhost:5173", // Vite React 기본 포트
    })
);

// JSON 파싱
app.use(express.json());

// === 테스트용 API 엔드포인트 ===
// [Server] 이슈에 해당
app.get("/api/test", (req: Request, res: Response) => {
    console.log("[/api/test] - React에서 요청이 왔습니다!");
    res.json({ message: "안녕하세요! Express 서버에서 보낸 응답입니다." });
});

app.listen(port, () => {
    console.log(
        `[Server] 🏃‍♂️ Express 서버가 http://localhost:${port} 에서 실행 중입니다.`
    );
});
