import { Link, useParams } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import Markdown from '@/components/Markdown'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButton from '@/components/ShareButton'
import SmartImage from '@/components/SmartImage'
import NotFound from '@/pages/NotFound'
import { getPost, formatDate, plainExcerpt } from '@/lib/content'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = getPost(slug)
  if (!post) {
    return (
      <NotFound
        title="We can't find that post"
        message="It may have been removed, or the link is wrong. See the full list of posts."
        linkTo="/blog"
        linkLabel="See posts"
      />
    )
  }
  return (
    <>
      <ReadingProgress />
      <PageShell
        title={post.title}
        intro={`${formatDate(post.date)}${post.author ? `, by ${post.author}` : ''}`}
        description={post.excerpt || plainExcerpt(post.body)}
      >
        <div className="mb-8">
          <ShareButton />
        </div>
        {post.cover && (
          <SmartImage
            src={post.cover}
            alt=""
            className="mb-8 max-h-48 w-full max-w-3xl rounded-lg object-cover sm:max-h-80"
          />
        )}
        <Markdown>{post.body}</Markdown>
        <p className="mt-10">
          <Link className="text-link inline-flex min-h-[44px] items-center" to="/blog">
            See posts
          </Link>
        </p>
      </PageShell>
    </>
  )
}
