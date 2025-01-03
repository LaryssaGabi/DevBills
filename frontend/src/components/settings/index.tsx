import { useState, useCallback } from 'react';
import { Button } from '../button';
import { Dialog } from '../dialog';
import { Title } from '../title';

import { Container, StyledIcon, Options } from './settings-styler';

export function Settings() {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen} trigger={<StyledIcon />}>
      <Container>
        <Title title="Configuração" subtitle="Escolha uma das opções abaixo" />
        <Options>
          <Button variant="text" type="button" onClick={() => console.log('Configuração das Categorias')}>
            Configuração das Categorias
          </Button>
          <Button variant="text" type="button" onClick={() => console.log('Sair')}>
            Sair Da Conta
          </Button>
        </Options>

        <footer>
          <Button onClick={handleClose} variant="outline" type="button">
            Cancelar
          </Button>
        </footer>
      </Container>
    </Dialog>
  );
}
