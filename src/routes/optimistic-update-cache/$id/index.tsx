import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import movieService from '@/services/movie';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/optimistic-update-cache/$id/')({
  component: MovieDetailScreen,
})

function MovieDetailScreen() {
  const { id } = Route.useParams();

  const movieQuery = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(id),
    enabled: !!id,
  });

  if (movieQuery.status === 'pending') {
    return (
      <div className="flex h-[50vh] items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <span className="ml-2">Loading... (one-time only)</span>
      </div>
    );
  }

  if (movieQuery.status === 'error') {
     return <div className="p-4 text-red-500">Error: {movieQuery.error.message}</div>;
  }

  const movie = movieQuery.data;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="container mx-auto p-4 space-y-4">
       <div className="flex items-center gap-2 mb-4">
          <Link to="/optimistic-update-cache">
             <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
       </div>

       <Card>
          <CardContent className="p-6 flex flex-col md:flex-row gap-6">
             <img src={movie.imageUrl} alt={movie.title} className="w-[200px] h-[300px] object-cover rounded shadow-md" />
             <div className="space-y-4 flex-1">
                 <div className="flex flex-wrap gap-2 items-center">
                     <span className="text-3xl font-bold">{movie.title}</span>
                     <span className="text-2xl text-muted-foreground">({movie.year})</span>
                 </div>
                 <Badge variant="secondary" className="text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400">
                    Rating: {movie.rate}/10
                 </Badge>
                 
                 <p className="text-lg leading-relaxed">{movie.description}</p>
                 
                 <div className="grid grid-cols-2 gap-4 max-w-md">
                     <div>
                         <div className="text-sm font-semibold text-muted-foreground">Director</div>
                         <div>{movie.director}</div>
                     </div>
                     <div>
                         <div className="text-sm font-semibold text-muted-foreground">Duration</div>
                         <div>{movie.duration}</div>
                     </div>
                      <div>
                         <div className="text-sm font-semibold text-muted-foreground">Genre</div>
                         <div className="flex gap-1 flex-wrap">
                            {Array.isArray(movie.genre) ? movie.genre.map(g => <Badge key={g} variant="outline">{g}</Badge>) : movie.genre}
                         </div>
                     </div>
                 </div>
             </div>
          </CardContent>
       </Card>

       {movieQuery.isFetching && !movieQuery.isPending && (
          <div className="text-center text-sm text-muted-foreground animate-pulse">
             Fetching in the background...
          </div>
       )}
    </div>
  );
}
