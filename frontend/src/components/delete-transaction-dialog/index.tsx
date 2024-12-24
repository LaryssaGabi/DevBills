import { useState, useCallback } from 'react';
import { Button } from '../button';
import { Dialog } from '../dialog';
import { Title } from '../title';
import { toast } from 'react-toastify';
import { Container, StyledIcon } from './delete-transaction';

export function DeleteTransactionForm({ item, onDelete }: { item: { _id: string }; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!item || !item._id) {
        return;
    }

    try {
        await onDelete(item._id);
        handleClose();
    } catch {
        toast.error('Erro ao excluir a transação. Tente novamente.');
    }
}, [item, onDelete, handleClose]);

  return (
    <Dialog open={open} onOpenChange={setOpen} trigger={<StyledIcon />}>
      <Container>
        <Title title="Exclusão De Transação" subtitle="Tem certeza que deseja excluir esta transação?" />
        <footer>
          <Button onClick={handleClose} variant="outline" type="button">
            Não
          </Button>
          <Button onClick={handleDelete} type="button">
            Sim
          </Button>
        </footer>
      </Container>
    </Dialog>
  );
}
