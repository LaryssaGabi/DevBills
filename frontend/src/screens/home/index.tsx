/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import { InputMask } from '@react-input/mask';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ButtonIcon } from '../../components/button-icon';
import { Card } from '../../components/card';
import { CategoriesPieChart, CategoryProps } from '../../components/categories-pie-chart';
import { CreateCategoryDialog } from '../../components/create-category-dialog';
import { CreateTransactionDialog } from '../../components/create-transaction-dialog';
import { FinancialEvolutionBarChart } from '../../components/financial-evolution-bar-chart';
import { Input } from '../../components/input';
import { Logo } from '../../components/logo';
import { Title } from '../../components/title';
import { Transaction } from '../../components/transaction';
import { EditTransactionForm } from '../../components/edit-transaction-dialog';
import { useFetchAPI } from '../../hooks/useFetchAPI';
import { transactionsFilterSchema } from '../../validators/schemas';
import { FinancialEvolutionFilterData, TransactionsFilterData } from '../../validators/types';
import { Aside, Balance, CategoryBadge, ChartAction, ChartContainer, ChartContent, Filters, Header, InputGroup, Main, SearchTransaction, Section, TransactionGroup } from './home-styles';
import { DeleteTransactionForm } from '../../components/delete-transaction-dialog';
import { APIService } from '../../services/api';
import { toast } from 'react-toastify';
import { Settings } from '../../components/settings';

export function Home() {
    const transactionsFilterForm = useForm<TransactionsFilterData>({
        defaultValues: {
            title: '',
            categoryId: '',
            beginDate: dayjs().startOf('month').format('DD/MM/YYYY'),
            endDate: dayjs().endOf('month').format('DD/MM/YYYY'),
        },
        resolver: zodResolver(transactionsFilterSchema),
    });

    const financialEvolutionFilterForm = useForm<FinancialEvolutionFilterData>({
        defaultValues: {
            year: dayjs().get('year').toString(),
        },
    });

    const { transactions, dashboard, financialEvolution, fetchFinancialEvolution, fetchTransactions, fetchDashboard } = useFetchAPI();

    useEffect(() => {
        const { beginDate, endDate } = transactionsFilterForm.getValues();
        fetchDashboard({ beginDate, endDate });
        fetchTransactions(transactionsFilterForm.getValues());
        fetchFinancialEvolution(financialEvolutionFilterForm.getValues());
    }, [fetchTransactions, transactionsFilterForm, fetchDashboard, fetchFinancialEvolution, financialEvolutionFilterForm]);

    const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null);

    const handleSelectCategory = useCallback(async ({ id, title, color }: CategoryProps) => {
        setSelectedCategory({ id, title, color });
        transactionsFilterForm.setValue('categoryId', id);
        await fetchTransactions(transactionsFilterForm.getValues());
    }, [transactionsFilterForm, fetchTransactions]);

    const handleDeselectCategory = useCallback(async () => {
        setSelectedCategory(null);
        transactionsFilterForm.setValue('categoryId', '');
        await fetchTransactions(transactionsFilterForm.getValues());
    }, [transactionsFilterForm, fetchTransactions]);

    const onSubmitTransactions = useCallback(async (data: TransactionsFilterData) => {
        await fetchTransactions(data);
    }, [fetchTransactions]);

    const onSubmitDashboard = useCallback(async (data: TransactionsFilterData) => {
        const { beginDate, endDate } = data;
        await fetchDashboard({ beginDate, endDate });
        await fetchTransactions(data);
    }, [fetchDashboard, fetchTransactions]);

    const onSubmitFinancialEvolution = useCallback(async (data: FinancialEvolutionFilterData) => {
        await fetchFinancialEvolution(data);
    }, [fetchFinancialEvolution]);

   
    const handleDeleteTransaction = useCallback(async (id: string) => {
        await toast.promise(
            APIService.deleteTransaction(id),
            {
                pending: 'Excluindo transação...',
                success: 'Transação excluída com sucesso!👌',
                error: 'Erro ao excluir transação. Tente novamente 🤯',
            }
        );

        fetchTransactions(transactionsFilterForm.getValues());
    }, [fetchTransactions, transactionsFilterForm]);



    return (
        <>
            <Header>
                <Logo />
                <div>
                    <CreateTransactionDialog />
                    <CreateCategoryDialog />
                    <Settings/>
                </div>
            </Header>
            <Main>
                <Section>
                    <Filters>
                        <Title title="Saldo" subtitle="Receitas e despesas no período" />
                        <InputGroup>
                            <InputMask
                                component={Input}
                                mask="dd/mm/aaaa"
                                replacement={{ d: /\d/, m: /\d/, a: /\d/ }}
                                variant="dark"
                                label="Início"
                                placeholder="dd/mm/aaaa"
                                error={transactionsFilterForm.formState.errors.beginDate?.message}
                                {...transactionsFilterForm.register('beginDate')}
                            />
                            <InputMask
                                component={Input}
                                mask="dd/mm/aaaa"
                                replacement={{ d: /\d/, m: /\d/, a: /\d/ }}
                                variant="dark"
                                label="Fim"
                                placeholder="dd/mm/aaaa"
                                error={transactionsFilterForm.formState.errors.endDate?.message}
                                {...transactionsFilterForm.register('endDate')}
                            />
                            <ButtonIcon onClick={transactionsFilterForm.handleSubmit(onSubmitDashboard)} />
                        </InputGroup>
                    </Filters>
                    <Balance>
                        <Card title="Saldo" amount={dashboard?.balance?.balance || 0} />
                        <Card title="Receitas" amount={dashboard?.balance?.income || 0} variant="incomes" />
                        <Card title="Gastos" amount={dashboard?.balance?.expense * -1 || 0} variant="expenses" />
                    </Balance>
                    <ChartContainer>
                        <header>
                            <Title title="Gastos" subtitle="Despesas por categoria no período" />
                            {selectedCategory && (
                                <CategoryBadge $color={selectedCategory.color} onClick={handleDeselectCategory}>
                                    <X />
                                    {selectedCategory.title.toUpperCase()}
                                </CategoryBadge>
                            )}
                        </header>
                        <ChartContent>
                            <CategoriesPieChart expenses={dashboard.expenses} onClick={handleSelectCategory} />
                        </ChartContent>
                    </ChartContainer>
                    <ChartContainer>
                        <header>
                            <Title title="Evolução Financeira" subtitle="Saldo, Receitas e Gastos no ano" />
                            <ChartAction>
                                <InputMask
                                    component={Input}
                                    mask="aaaa"
                                    replacement={{ a: /\d/ }}
                                    variant="black"
                                    label="Ano"
                                    placeholder="aaaa"
                                    {...financialEvolutionFilterForm.register('year')}
                                />
                                <ButtonIcon onClick={financialEvolutionFilterForm.handleSubmit(onSubmitFinancialEvolution)} />
                            </ChartAction>
                        </header>
                        <ChartContent>
                            <FinancialEvolutionBarChart financialEvolution={financialEvolution} />
                        </ChartContent>
                    </ChartContainer>
                </Section>
                <Aside>
                    <header>
                        <Title title="Transações" subtitle="Receitas e Gastos no período" />
                        <SearchTransaction>
                            <Input
                                variant="black"
                                placeholder="Procurar transação..."
                                {...transactionsFilterForm.register('title')}
                            />
                            <ButtonIcon onClick={transactionsFilterForm.handleSubmit(onSubmitTransactions)} />
                        </SearchTransaction>
                    </header>
                    <TransactionGroup>
                        {transactions?.length &&
                            transactions?.map((item, index) => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Transaction
                                        id={index + 1}
                                        amount={item.type === 'expense' ? item.amount * -1 : item.amount}
                                        date={dayjs(item.date).add(3, 'hours').format('DD/MM/YYYY')}
                                        category={{
                                            title: item.category.title,
                                            color: item.category.color,
                                        }}
                                        title={item.title}
                                        variant={item.type}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <EditTransactionForm transaction={item}/>
                                        <DeleteTransactionForm
                                            item={item}
                                            onDelete={handleDeleteTransaction}
                                        />
                                    </div>
                                </div>
                            ))}
                    </TransactionGroup>
                </Aside>
            </Main>
        </>
    );
}
