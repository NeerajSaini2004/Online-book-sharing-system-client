import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';

export const FormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBlog(id);
      if (response.success) {
        const foundBlog = response.data;
        setBlog({
          id: foundBlog._id,
          title: foundBlog.title,
          content: foundBlog.content,
          author: foundBlog.author?.name || 'Anonymous',
          authorRole: foundBlog.author?.role || 'student',
          category: foundBlog.category,
          replies: foundBlog.replies || 0,
          views: foundBlog.views || 0,
          likes: foundBlog.likes || 0,
          tags: foundBlog.tags || [],
          createdAt: new Date(foundBlog.createdAt).toLocaleDateString()
        });
      }
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setBlog(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleReply = () => {
    if (replyText.trim()) {
      setBlog(prev => ({
        ...prev,
        replies: prev.replies + 1
      }));
      setReplyText('');
      setShowReplyBox(false);
      alert('Reply posted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog not found</p>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate('/blog')} variant="outline" className="mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        <Card>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {blog.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{blog.author}</span>
                  <Badge variant={blog.authorRole === 'library' ? 'primary' : 'secondary'} size="sm">
                    {blog.authorRole}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{blog.createdAt}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline" className="capitalize">
                {blog.category}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                <span>{blog.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <HeartIcon className="h-4 w-4" />
                <span>{blog.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>{blog.replies} replies</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{blog.content}</p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex gap-3 mb-4">
              <Button variant="outline" onClick={handleLike} className={liked ? 'bg-red-50 border-red-300 text-red-600' : ''}>
                <HeartIcon className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" onClick={() => setShowReplyBox(!showReplyBox)}>
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>

            {showReplyBox && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-3 border rounded-lg mb-3"
                  rows="3"
                />
                <div className="flex gap-2">
                  <Button onClick={handleReply} size="sm">Post Reply</Button>
                  <Button onClick={() => setShowReplyBox(false)} variant="outline" size="sm">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};