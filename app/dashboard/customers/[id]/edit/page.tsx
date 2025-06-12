import { notFound } from 'next/navigation';
import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customers = await fetchCustomers();
  const customer = customers.find((c) => c.id === params.id);
  if (!customer) notFound();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Edit Customer', href: `/dashboard/customers/${params.id}/edit`, active: true },
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}
