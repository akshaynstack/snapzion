"use client";

import { useState } from "react";
import {
  Loader2,
  Download,
  Share2,
  Image as ImageIcon,
  Wand2,
  History,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, usePaginatedQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import InfiniteScroll from 'react-infinite-scroll-component';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: string;
  style?: string;
  size?: string;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedSize, setSelectedSize] = useState("1024x768");
  const [activeTab, setActiveTab] = useState("generate");
  const saveImageMutation = useMutation(api.image.saveImage);
  
  // Use paginated query to fetch images
  const { results: generatedImages, status, loadMore } = usePaginatedQuery(
    api.image.fetchImages,
    {},
    { initialNumItems: 9 } // Load 9 images initially
  );

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const urlPattern = /!\[\]\((https?:\/\/[^\s]+)\)/;
      const match = data.content.match(urlPattern);

      if (match && match[1]) {
        const newImage: GeneratedImage = {
          url: match[1],
          prompt,
          timestamp: String(Date.now()),
          style: selectedStyle,
          size: selectedSize,
        };

        // Call the Convex mutation to save the image
        await saveImageMutation({
          url: newImage.url,
          prompt: newImage.prompt,
          style: newImage.style ?? "realistic",
          size: newImage.size ?? "1024x768",
        });

        toast.success("Image generated successfully!");
        setPrompt(""); // Clear the prompt after generation
      } else {
        throw new Error("No valid image URL found in the response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded successfully");
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  const shareImage = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Generated Image",
          text: "Check out this AI-generated image!",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Image URL copied to clipboard");
      }
    } catch (err) {
      toast.error("Failed to share image");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-6 bg-gradient-to-b from-[#1E1E1E] to-[#000000] shadow-neon-green border-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="space-y-6">
            <form onSubmit={generateImage} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button type="submit" disabled={isLoading || !prompt} className="min-w-[120px] bg-[#DDFF00] text-black hover:bg-[#DDFF02]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="text-destructive text-center p-4 rounded-lg bg-destructive/10">
                {error}
              </div>
            )}
            
            <InfiniteScroll
              dataLength={generatedImages.length} // Important field to render the next data
              next={() => loadMore(generatedImages.length)}  // Pass the number of items to loadMore
              hasMore={status === "CanLoadMore"}
              loader={<Skeleton className="h-4 w-3/4" />}
              endMessage={<p style={{ textAlign: 'center', color: 'white', paddingTop: '40px' }}>No more images to load</p>}
            >


              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && (
                  <Skeleton className="h-full w-full aspect-square" />
                )}
                {generatedImages.map((image, index) => (
                  <Card key={index} className="overflow-hidden group">
                    <div className="aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">{image.style}</Badge>
                        <Badge variant="outline">{image.size}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{image.prompt}</p>
                      <p className="text-xs text-muted-foreground">{new Date(image.timestamp).toLocaleString()}</p>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => downloadImage(image.url)} className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => shareImage(image.url)} className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </InfiniteScroll>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-satoshi-semibold text-white">Generation History</h3>
                {generatedImages.length > 0 && (
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[600px] rounded-lg border">
                {generatedImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No images generated yet</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {generatedImages.map((image, index) => (
                      <Card key={index} className="flex gap-4 p-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{image.style}</Badge>
                            <Badge variant="outline">{image.size}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(image.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="ghost" size="sm" onClick={() => downloadImage(image.url)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => shareImage(image.url)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}