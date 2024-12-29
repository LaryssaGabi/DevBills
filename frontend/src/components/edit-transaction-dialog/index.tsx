import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useFetchAPI } from '../../hooks/useFetchAPI';
import { createTransactionSchema } from '../../validators/schemas';
import { CreateTransactionData } from '../../validators/types';
import { Button } from '../button';
import { Dialog } from '../dialog';
import { Input } from '../input';
import { Title } from '../title';
import { Container, Content, CurrencyInput, ErrorMessage, InputGroup, RadioForm, RadioGroup, StyledIcon, } from './styles-edit-transaction';

type EditTransactionFormProps = {
  transaction?: {
    _id: string;
    title: string;
    date: Date;
    amount: number;
    type: 'income' | 'expense';
    category: {
      _id: string;
      title: string;
      color: string;
    };
  };
};

export function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const { categories, fetchCategories, updateTransaction } = useFetchAPI();
  const [open, setOpen] = useState(false);

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateTransactionData>({
    defaultValues: {
      categoryId: 'null',
      title: '',
      amount: '',
      date: dayjs().format('DD/MM/YYYY'),
      type: 'income',
    },
    resolver: zodResolver(createTransactionSchema),
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    if (transaction && open) {
      setValue('categoryId', transaction.category._id);
      setValue('title', transaction.title);
      setValue('amount', transaction.amount.toString());
      setValue('date', dayjs(transaction.date).format('DD/MM/YYYY'));
      setValue('type', transaction.type);
    }
  }, [transaction, open, setValue]);

  const handleClose = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset]);

  const onSubmit = useCallback(
    async (data: CreateTransactionData) => {
      if (transaction) {
        await updateTransaction(transaction._id, data);
      }
      handleClose();
    },
    [transaction, handleClose, updateTransaction]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<StyledIcon />}
    >
      <Container>
        <Title
          title="Editar Transação"
          subtitle="Edite a transação para um melhor controle financeiro"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Content>
            <InputGroup>
              <label>Categoria</label>
              <select {...register('categoryId')}>
                <option value="null">Selecione uma categoria...</option>
                {categories?.length &&
                  categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title}
                    </option>
                  ))}
              </select>
              {errors.categoryId && (
                <ErrorMessage>{errors.categoryId.message}</ErrorMessage>
              )}
            </InputGroup>

            <Input
              label="Nome"
              placeholder="Nome da transação..."
              {...register('title')}
              error={errors.title?.message}
            />

            <InputGroup>
              <label>Valor</label>
              <CurrencyInput
                placeholder="R$ 0,00"
                format="currency"
                currency="BRL"
                {...register('amount')}
              />
              {errors.amount && (
                <ErrorMessage>{errors.amount.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputMask
              component={Input}
              mask="dd/mm/aaaa"
              replacement={{ d: /\d/, m: /\d/, a: /\d/ }}
              label="Data"
              variant="black"
              placeholder="dd/mm/aaaa"
              error={errors.date?.message}
              {...register('date')}
            />

            <RadioForm>
              <RadioGroup>
                <input
                  type="radio"
                  id="income"
                  value="income"
                  {...register('type')}
                />
                <label htmlFor="income">Receita</label>
              </RadioGroup>

              <RadioGroup>
                <input
                  type="radio"
                  id="expense"
                  value="expense"
                  {...register('type')}
                />
                <label htmlFor="expense">Gasto</label>
              </RadioGroup>
              {errors.type && (
                <ErrorMessage>{errors.type.message}</ErrorMessage>
              )}
            </RadioForm>
          </Content>

          <footer>
            <Button onClick={handleClose} variant="outline" type="button">
              Cancelar
            </Button>
            <Button type="submit">Atualizar</Button>
          </footer>
        </form>
      </Container>
    </Dialog>
  );
}
