export default function ErrorPage({ error }: { error: string }) {
    return <p>Sorry, something went wrong {error}</p>
}