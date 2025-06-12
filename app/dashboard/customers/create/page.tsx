import { notFound } from 'next/navigation';
import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page() {
  const customers = await fetchCustomers();
  if (!customers) notFound();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          { label: 'Create Customer', href: '/dashboard/customers/create', active: true },
        ]}
      />
      <Form />
    </main>
  );
}
