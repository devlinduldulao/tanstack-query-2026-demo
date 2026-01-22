import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import movieService from "@/services/movie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/optimistic-update-cache/$id/")({
  component: MovieDetailScreen,
});

function MovieDetailScreen() {
  const { id } = Route.useParams();

  const movieQuery = useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieService.getMovieById(id),
    enabled: !!id,
  });

  if (movieQuery.status === "pending") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Loading... (one-time only)</span>
      </div>
    );
  }

  if (movieQuery.status === "error") {
    return <div className="p-4 text-red-500">Error: {movieQuery.error.message}</div>;
  }

  const movie = movieQuery.data;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Link to="/optimistic-update-cache">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{movie.title}</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row">
          <img src={movie.imageUrl} alt={movie.title} className="h-[300px] w-[200px] rounded object-cover shadow-md" />
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xl font-bold">{movie.title}</span>
              <span className="text-muted-foreground text-2xl">({movie.year})</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
            >
              Rating: {movie.rate}/10
            </Badge>

            <p className="text-lg leading-relaxed">{movie.description}</p>

            <div className="grid max-w-md grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground text-sm font-semibold">Director</div>
                <div>{movie.director}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm font-semibold">Duration</div>
                <div>{movie.duration}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm font-semibold">Genre</div>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(movie.genre)
                    ? movie.genre.map((g) => (
                        <Badge key={g} variant="outline">
                          {g}
                        </Badge>
                      ))
                    : movie.genre}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {movieQuery.isFetching && !movieQuery.isPending && (
        <div className="text-muted-foreground animate-pulse text-center text-sm">Fetching in the background...</div>
      )}
    </div>
  );
}
