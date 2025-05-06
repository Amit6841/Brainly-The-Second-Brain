import { JSX, useState } from "react";
import toast from "react-hot-toast";
import { formatDistance } from "date-fns";
import { FaTwitter, FaYoutube, FaRegEdit, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { IoDocument } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { LinkedInEmbed } from 'react-social-media-embed';
import TweetEmbed from "react-tweet-embed";
import Delete from "./Delete";
import EditContent from "./EditContent";

interface CardProps {
  title: string;
  link: string;
  type: string;
  content: string;
  tags?: string[];
  createdAt: string;
  _id: string;
  isSharedBrain?: boolean;
  onClick?: (id: string) => void;
}

async function shareUrl(title: string, link: string) {
  try {
    await navigator.share({
      text: title,
      url: link,
    });
  } catch (error) {
    toast.error((error as Error).message || "Error sharing content");
    console.error(error);
  }
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop()?.split("?")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } else if (url.includes("youtube.com")) {
      const videoId = new URLSearchParams(url.split("?")[1]).get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function getInstagramEmbedUrl(url: string): string | null {
  try {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([^\/\?]+)/);
    return match ? `https://www.instagram.com/p/${match[1]}/embed` : null;
  } catch {
    return null;
  }
}

function getSpotifyEmbedUrl(url: string): string | null {
  try {
    return url.includes('spotify.com') ? url.replace('open.spotify.com', 'embed.spotify.com') : null;
  } catch {
    return null;
  }
}

export const Card = ({
  title,
  type,
  link,
  tags,
  content,
  createdAt,
  _id,
  isSharedBrain,
}: CardProps) => {
  const icon: { [key: string]: JSX.Element } = {
    Youtube: <FaYoutube className="text-red-500" />,
    Twitter: <FaTwitter className="text-blue-400 " />,
    Linkedin: <FaLinkedin className="text-blue-900 " />,
    Document: <IoDocument className="text-yellow-600" />,
    Spotify: <FaSpotify className="text-green-500" />,
    Instagram: <FaInstagram className="text-pink-500" />,
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="bg-white h-full dark:bg-[rgb(28,28,28)] col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 rounded-lg min-w-[300px] max-w-[300px]" >
      <Delete
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={() => setIsDeleteModalOpen(false)}
        contentId={_id}
        onDelete={(id: string) => {
          console.log(`Content with ID ${id} deleted.`);
        }}
      />
      <EditContent
        isEditModalOpen={isEditModalOpen}
        closeEditModal={() => setIsEditModalOpen(false)}
        contentId={_id}
        initialData={{
          title,
          link,
          type,
          tags,
        }}
        onUpdate={() => {
          toast.success("Content updated successfully");
          setIsEditModalOpen(false);
        }}
      />

        <div className="flex justify-between mb-2">
          <div className="flex gap-2 items-center">
            <div className="text-2xl text-gray-600 dark:text-gray-300">
              {icon[type] || <FaYoutube />}
            </div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {type}
            </h1>
          </div>
          <div className="flex gap-4 items-center text-gray-600 dark:text-gray-300">
            {!isSharedBrain && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <FaRegEdit className="text-xl" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <MdDelete className="text-xl" />
                </button>
              </>
            )}
            <button
              onClick={() => shareUrl(title, link)}
              className="hover:text-green-500 dark:hover:text-green-400 transition-colors"
            >
              <IoMdShare className="text-xl" />
            </button>
          </div>
        </div>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <p className="text-gray-900 dark:text-gray-100 text-lg">{title}</p>

        <div className="pt-4 w-[100%]">  
          {type === "Youtube" && link && (() => {
            const embedUrl = getYoutubeEmbedUrl(link);
            return embedUrl ? (
              <iframe
                className="w-full aspect-video rounded-lg"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                <FaYoutube className="inline mr-2" />View on YouTube
              </a>
            );
          })()}

          {type === "Twitter" && (() => {
            const getTweetId = (url: string) => {
              // Handle both twitter.com and x.com URLs
              const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
              return match ? match[1] : null;
            };
          
            const tweetId = getTweetId(link);
            return tweetId ? (
              <div className="w-full relatine overflow-hidden rounded-lg">
                <TweetEmbed
                  tweetId={tweetId}
                  options={{
                    align: 'center',
                    width: '100%',
                    className: 'w-full rounded-lg',
                  }}
                  
                />
              </div>
            ) : (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-500 transition-colors"
              >
                <FaTwitter className="text-xl" />
                <span>View on Twitter</span>
              </a>
            );
          })()}

          {type === "Instagram" && (() => {
            const embedUrl = getInstagramEmbedUrl(link);
            return embedUrl ? (
              <iframe
                className="w-full h-[100%] aspect-4/5 rounded-lg"
                src={embedUrl}
                title="Instagram post"
                frameBorder="0"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                <FaInstagram className="inline mr-2" />View on Instagram
              </a>
            );
          })()}

          {type === "Linkedin" && (
            <div className="linkedin-embed-container">
              <LinkedInEmbed url={link} width="100%" />
            </div>
          )}

          {type === "Spotify" && (() => {
            const embedUrl = getSpotifyEmbedUrl(link);
            return embedUrl ? (
              <iframe
                className="w-full rounded-lg"
                src={embedUrl}
                width="100%"
                height="380"
                frameBorder="0"
                allow="encrypted-media"
                loading="lazy"
                title="Spotify content"
              />
            ) : (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
                <FaSpotify className="inline mr-2" />Listen on Spotify
              </a>
            );
          })()}

          {type === "Document" && (
            <div className="w-full">
              {link ? (
                <div className="w-full min-h-[400px]">
                  {link.match(/\.(pdf|doc|docx)$/i) ? (
                    <iframe
                      className="w-full min-h-[400px] rounded-md"
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(link)}&embedded=true`}
                      title="Document viewer"
                      frameBorder="0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md">
                      <IoDocument className="text-4xl text-gray-400 mb-2" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                      >
                        <span>View Document</span>
                        <IoDocument className="text-xl" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-white capitalize">
                  {content}
                </div>
              )}
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}

              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <hr className="mt-1 border-gray-200 dark:border-gray-700" />

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          {formatDistance(new Date(createdAt), new Date())} ago
        </p>
      
    </div>
  );
};

export default Card;
