import {useState} from "react"

import { type NextPage } from "next";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import { SignIn, useUser, UserButton, useSession } from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";

// import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);

import Link from "next/link";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

type Repo = {
};

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="border-b border-slate-400 p-8">
      <Link href={`/@${author.username}`}>
        <span>@{author.username}</span>
      </Link>

      <Link href={`/post/${post.id}`}>
        <span className="font-thin">{` . ${dayjs(
          post.createdAt
        ).fromNow()}`}</span>
      </Link>

      <p>{post.content} </p>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Somehing went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { user, isSignedIn, isLoaded: userLoaded } = useUser();

  api.posts.getAll.useQuery()

  if (!userLoaded) return <div />;

  const CreatePostWizard = () => {
    const [input, setInput] = useState("")

    const ctx = api.useContext()
    
    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("")
        void ctx.posts.getAll.invalidate()
      },
      onError: (e) => {
        //@ts-ignore
        toast.error("Failed to post!, Please try again later. " + e.data?.zodError?.fieldErrors?.content[0]!)
      }
    })

    // mutate()

    if (!isSignedIn) return null;

    return (
      <div className="flex w-full gap-4">
        <h2 className="mb-4">Hi user</h2>
        <input
          placeholder="Type some emojis"
          className="grow bg-transparent"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={() => mutate({content: input})}>Post</button>

      </div>
    );
  };


  // if (postsLoaded) return <LoadingPage />;

  // if (!data) return <div>No data</div>;

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          {isSignedIn ? (
            <div className="mb-6">
              <UserButton afterSignOutUrl="/" />
              <CreatePostWizard />
            </div>
          ) : null}

          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />

          <Feed />

        </div>
      </main>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const { data} = api.posts.getAll.useQuery();
//   console.log("🚀 ~ file: index.tsx:128 ~ constgetServerSideProps:GetServerSideProps= ~ data:", data)
//   return { props: {  } };
// };

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
