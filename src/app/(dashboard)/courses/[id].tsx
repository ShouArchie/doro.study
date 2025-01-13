import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';

interface PostProps {
  id: string;
}

const Post: NextPage<PostProps> = ({ id }) => {
  const router = useRouter();

  // If fallback is enabled, this shows a loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <h1>Post ID: {id}</h1>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Example: Pre-render these paths at build time
  const paths = [{ params: { id: '1' } }, { params: { id: '2' } }];

  return {
    paths,
    fallback: true, // Enable fallback for undefined routes
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!; // Ensure `params` is not undefined

  return {
    props: {
      id, // Pass the dynamic `id` as a prop
    },
    revalidate: 10, // Revalidate at most every 10 seconds
  };
};

export default Post;
