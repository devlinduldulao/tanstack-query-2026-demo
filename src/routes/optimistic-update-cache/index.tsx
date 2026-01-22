import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import movieService from "@/services/movie";
import type { Movie } from "@/models";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Star, Clapperboard } from "lucide-react";
import { PulsingDot } from "@/components/pulsing-dot";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/optimistic-update-cache/")({
  component: MoviesScreen,
});

function MoviesScreen() {
  const queryClient = useQueryClient();

  const moviesQuery = useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: () => movieService.getMovies(),
  });

  const deleteMovieMutation = useMutation({
    mutationKey: ["movies", "delete"],
    mutationFn: (id: string) => movieService.deleteMovie(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["movies"] });
      const previousMovies = queryClient.getQueryData<Movie[]>(["movies"]);
      queryClient.setQueryData<Movie[]>(["movies"], (old) => old?.filter((m) => String(m.id) !== String(id)) ?? []);
      queryClient.removeQueries({ queryKey: ["movie", id] });
      return { previousMovies };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMovies) {
        queryClient.setQueryData<Movie[]>(["movies"], context.previousMovies);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMovieMutation.mutate(id);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Movie Feed</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clapperboard className="h-4 w-4" />
            Optimistic UI updates on delete
            {moviesQuery.isFetching && <PulsingDot />}
          </p>
        </div>
        {/* Add Movie Button could go here */}
      </div>

      {moviesQuery.status === "error" && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-4">
          Error: {moviesQuery.error.message}
        </div>
      )}

      {moviesQuery.status === "pending" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="flex gap-4 p-4">
                <Skeleton className="h-[140px] w-[95px] rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {moviesQuery.data?.map((movie) => (
            <Card key={movie.id} className="group border-muted overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="flex h-full p-0">
                <div className="relative shrink-0">
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="h-full w-[110px] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="h-5 gap-1 border-0 bg-black/60 px-1.5 text-[10px] text-white backdrop-blur-sm hover:bg-black/70"
                    >
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {movie.rate}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`group-hover:text-primary text-lg leading-tight font-bold transition-colors ${queryClient.getQueryData(["movie", String(movie.id)]) ? "text-primary" : ""}`}
                        >
                          {movie.title}
                        </h3>
                        <span className="text-muted-foreground text-sm">{movie.year}</span>
                      </div>

                      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link to="/optimistic-update-cache/$id" params={{ id: String(movie.id) }}>
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleDelete(String(movie.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                      {movie.description}
                    </p>
                  </div>

                  <div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="max-w-[150px] truncate">Dir. {movie.director}</span>
                    <span className="font-mono">{movie.duration} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
