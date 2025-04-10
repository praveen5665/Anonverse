import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCommunityByName } from "@/services/communityService";
import { createPost } from "@/services/postService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

const SubmitPage = () => {
  const { communityName } = useParams();
  const navigate = useNavigate();
  const [communityId, setCommunityId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await getCommunityByName(communityName);
        // console.log(response.data.data._id);
        setCommunityId(response.data.data._id);
      } catch (error) {
        console.error("Failed to load community:", error);
        setError("Community not found.");
      }
    };
    fetchCommunity();
  }, [communityName]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    setError(null);
    setSuccess(false);
  };

  const validateForm = () => {
    if (!title || !content) {
      setError("Title and content are required.");
      return false;
    }
    if(title.length < 3) {
      setError("Title must be at least 3 characters long.");
      return false;
    }
    if (content.length < 10) {
      setError("Content must be at least 10 characters long.");
      return false;
    }
    if (title.length > 100) {
      setError("Title cannot exceed 100 characters.");
      return false;
    }
    if (content.length > 1000) {
      setError("Content cannot exceed 1000 characters.");
      return false;
    }
    if (image && image.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size cannot exceed 5MB.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()) {
      return;
    }
    if(!communityId) { 
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("community", communityId);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await createPost(formData);
      if (!response.data.success) {
        throw new Error("Failed to create post");
      }
      setSuccess(true);
      navigate(`/r/${communityName}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create a post in r/{communityName}</h1>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your post title"
              value={title}
              onChange={handleTitleChange}
              maxLength={100}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              rows={6}
              maxLength={1000}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's on your mind?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById("image").click()}
              >
                <ImageIcon className="w-4 h-4" />
                Choose Image
              </Button>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-md">
              Post created successfully!
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage;
