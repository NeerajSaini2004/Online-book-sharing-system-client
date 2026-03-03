import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChatBubbleLeftIcon, 
  EyeIcon, 
  HeartIcon,
  MagnifyingGlassIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';

export const BlogPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'textbooks', tags: '', content: '' });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await apiService.getBlogs();
      const blogs = response.data.map(blog => ({
        id: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author.name,
        authorRole: blog.author.role,
        category: blog.category,
        replies: blog.replies,
        views: blog.views,
        likes: blog.likes,
        timeAgo: getTimeAgo(blog.createdAt),
        tags: blog.tags
      }));
      setPosts(blogs);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handlePublishArticle = async (e) => {
    e.preventDefault();
    try {
      await apiService.createBlog({
        title: newArticle.title,
        content: newArticle.content,
        category: newArticle.category,
        tags: newArticle.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setNewArticle({ title: '', category: 'textbooks', tags: '', content: '' });
      setShowNewArticleModal(false);
      loadBlogs();
    } catch (error) {
      alert('Failed to publish article: ' + error.message);
    }
  };

  const categories = [
    { id: 'all', name: 'All Articles', count: 156 },
    { id: 'textbooks', name: 'Textbooks', count: 45 },
    { id: 'notes', name: 'Study Notes', count: 32 },
    { id: 'exams', name: 'Exam Prep', count: 28 },
    { id: 'general', name: 'General', count: 51 }
  ];

  const filteredPosts = posts.filter(post => 
    (activeTab === 'all' || post.category === activeTab) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-600 mt-2">Read articles, share knowledge, and connect with fellow learners</p>
          </div>
          <Button onClick={() => setShowNewArticleModal(true)} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New Article
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`w-full flex justify-between items-center p-3 rounded-lg text-left transition-colors ${
                      activeTab === category.id
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-orange-500" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {['JEE', 'NEET', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((tag) => (
                  <Badge key={tag} onClick={() => setSearchQuery(tag)} variant="outline" className="cursor-pointer hover:bg-primary-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <Input
                placeholder="Search articles..."
                icon={<MagnifyingGlassIcon />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="cursor-pointer" onClick={() => window.location.href = `/blog/${post.id}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{post.author}</span>
                            <Badge variant={post.authorRole === 'library' ? 'primary' : 'secondary'} size="sm">
                              {post.authorRole}
                            </Badge>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{post.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          <span>{post.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HeartIcon className="h-4 w-4" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                      <Badge variant="outline" size="sm">
                        {post.category}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* New Article Modal */}
        {showNewArticleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Write New Article</h3>
              <form className="space-y-4" onSubmit={handlePublishArticle}>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input type="text" value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} placeholder="Enter article title" className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})} className="w-full p-3 border rounded-lg" required>
                    <option value="textbooks">Textbooks</option>
                    <option value="notes">Study Notes</option>
                    <option value="exams">Exam Prep</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input type="text" value={newArticle.tags} onChange={(e) => setNewArticle({...newArticle, tags: e.target.value})} placeholder="e.g., JEE, Physics, NEET" className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea value={newArticle.content} onChange={(e) => setNewArticle({...newArticle, content: e.target.value})} placeholder="Write your article content..." className="w-full p-3 border rounded-lg" rows="10" required></textarea>
                </div>
                <div className="flex space-x-3">
                  <Button type="button" onClick={() => setShowNewArticleModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Publish Article</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};