import React from "react";
import Card from "./Card";
import Button from "./Button";
import SectionTitle from "./SectionTitle";
import Typography from "./Typography";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
}) => {
    if (!isOpen) return null;

    return (
        // 1. 모달 배경 (Overlay)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose} // 배경 클릭 시 닫기
        >
            {/* 2. 모달 컨텐츠 (Card) */}
            <Card
                className="w-full max-w-md p-6 m-4"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫기 방지
            >
                <div className="text-center space-y-4">
                    {/* 제목 */}
                    <SectionTitle className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-2 text-center">
                        {title}
                    </SectionTitle>

                    {/* 메시지 */}
                    <Typography
                        variant="body"
                        className="text-gray-700 dark:text-gray-700 text-center mb-6"
                    >
                        {message}
                    </Typography>

                    {/* 확인 버튼 */}
                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            onClick={onClose}
                            className="w-full md:w-auto min-w-[120px]"
                        >
                            확인
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AlertModal;
