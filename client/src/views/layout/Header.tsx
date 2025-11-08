import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Typography from "../../components/Typography";
import Button from "../../components/Button";

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between border-b border-gray-400">
            <Link to="/" className="mx-4 my-6">
                <Typography
                    as="h1"
                    variant="body"
                    className="text-4xl font-bold text-center text-white"
                >
                    GitHub AI Blogger
                </Typography>
            </Link>
            <div className="flex space-x-2 items-center justify-between mx-4">
                <Button
                    variant="secondary"
                    size="big"
                    className="shrink-0"
                    onClick={() => navigate("/saved-posts")}
                >
                    Saved Posts
                </Button>
                <Button
                    variant="secondary"
                    size="big"
                    className="shrink-0"
                    onClick={() => navigate("/settings")}
                >
                    Settings
                </Button>
            </div>
        </header>
    );
};

export default Header;
