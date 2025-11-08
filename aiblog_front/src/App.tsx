import { useState, useEffect } from "react";
import axios from "axios"; // [Client] 'axios' 설치 이슈
import "./App.css";

function App() {
    // 서버에서 받은 메시지를 저장할 state
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 백엔드 서버의 /api/test 엔드포인트로 GET 요청
        // [Client] API 통신 모듈 생성 이슈 (우선 App.tsx에서 바로 테스트)
        axios
            .get("http://localhost:8000/api/test") // STEP 1에서 설정한 8000번 포트
            .then((response) => {
                setMessage(response.data.message); // 성공 시 state에 메시지 저장
                setLoading(false);
            })
            .catch((error) => {
                console.error("서버 연결 중 오류 발생:", error);
                setError("서버에 연결할 수 없습니다.");
                setLoading(false);
            });
    }, []);

    return (
        <>
            <h1>GitHub AI 블로거</h1>
            <hr />
            <h2>서버 연결 테스트:</h2>

            {loading && <p>서버에서 데이터를 불러오는 중...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {message && (
                <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
            )}
        </>
    );
}

export default App;
