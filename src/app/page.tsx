import { getAllPosts } from "@/lib/posts";
import HomeView from "@/components/home/HomeView";

export default async function Home() {
  const posts = await getAllPosts();

  return <HomeView posts={posts} />;
}
