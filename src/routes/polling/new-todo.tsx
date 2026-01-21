import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useTodoMutation } from '@/state/server/mutations/todoMutations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/polling/new-todo')({
  component: NewTodoScreen,
})

function NewTodoScreen() {
  const [todoValue, setTodoValue] = useState('');
  const addTodoMutation = useTodoMutation();
  const navigate = Route.useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoValue.trim()) {
      addTodoMutation.mutate(todoValue, {
         onSuccess: () => {
             setTodoValue('');
             // Optionally navigate back
             navigate({ to: '/polling' });
         }
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-md">
       <Link to="/polling">
         <Button variant="ghost" size="sm" className="mb-2"><ArrowLeft className="mr-2 h-4 w-4"/> Back to list</Button>
       </Link>
      <Card>
        <CardHeader>
           <CardTitle>Create a new todo</CardTitle>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
               <Input 
                  value={todoValue}
                  onChange={(e) => setTodoValue(e.target.value)}
                  placeholder="Enter todo task..."
                  autoFocus
               />
               <Button type="submit" className="w-full" disabled={addTodoMutation.isPending}>
                  {addTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
               </Button>
           </form>
        </CardContent>
      </Card>
    </div>
  );
}
