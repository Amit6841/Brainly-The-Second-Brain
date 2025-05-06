import Share from "../components/Share";
import Content from "../components/Content";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";


interface CardProps {
    title: string;
    type: string;
    link: string;
    content: string;
    tags?: string[];
    createdAt: string;
    _id: string;
    isSharedBrain?: boolean;
    onClick?: (id: string) => void;  
}

const Home = ({ filterType }: { filterType?: string }) => {
    const [contentData, setContentData] = useState<CardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/content", { withCredentials: true });
                setContentData(response.data.data);
            } catch (err: any) {
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const filteredContent = filterType
        ? contentData.filter((content) => content.type === filterType)
        : contentData;


    return (
        <div className="h-full w-full p-5">
            {loading ? (
                <div className=" w-full h-screen flex justify-center items-center ">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2  border-blue-500"></div>
                </div>
            
            ) : filteredContent.length > 0 ? (
                <div  className="space-y-5 space-x-5 flex flex-wrap">
                    {filteredContent.map((content) => (
                        <Card
                            key={content._id}
                            title={content.title}
                            type={content.type}
                            link={content.link}
                            content={content.content}
                            tags={content.tags}
                            _id={content._id}
                            isSharedBrain={content.isSharedBrain}
                            createdAt={content.createdAt}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-screen">
                    <p className="text-gray-600 dark:text-gray-300 text-2xl">
                        {isAuthenticated
                            ? "No content found. Start by adding some content!"
                            : "No content found. Please login to add content!"}
                    </p>
                </div>
            )}

            {isAuthenticated && (
                <div className="fixed flex bottom-10 right-10 gap-5">
                    <Share />
                    <Content />
                </div>
            )}

        </div>
    );
};

export default Home;