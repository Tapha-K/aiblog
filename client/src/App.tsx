import { Routes, Route } from "react-router-dom";
import Layout from "./views/layout/Layout";
import HomePage from "./views/homepage/HomePage";
import SavedPostsPage from "./views/savedpage/SavedPage";
import SettingsPage from "./views/settingspage/SettingsPage";
import Typography from "./components/Typography"; // 404 페이지용

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="saved-posts" element={<SavedPostsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route
                    path="*"
                    element={
                        <div className="text-center p-10">
                            <Typography
                                as="h1"
                                variant="body"
                                className="text-2xl font-bold"
                            >
                                404 - Page Not Found
                            </Typography>
                        </div>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
