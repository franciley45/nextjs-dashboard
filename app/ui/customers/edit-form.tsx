'use client';
import { useRef, useState } from 'react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { updateCustomer } from '@/app/lib/actions';

export default function EditCustomerForm({ customer }: { customer: any }) {
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const formRef = useRef<HTMLFormElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<File | null>(null);

  return (
    <form
      action={async (formData) => {
        const fileInput = formRef.current?.elements.namedItem('image_file') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/api/upload-customer-image', {
            method: 'POST',
            body: form,
          });
          const { imageUrl } = await res.json();
          formData.set('image_url', imageUrl);
        } else {
          // Se não houver upload, mantém o caminho antigo
          formData.set('image_url', customer.image_url);
        }
        updateCustomerWithId(formData);
      }}
      ref={formRef}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Imagem do Cliente
          </label>
          <label htmlFor="image_file" className="flex items-center gap-2 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition-colors">
            <span>Selecionar imagem</span>
            <input
              id="image_file"
              name="image_file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedFile(file.name);
                  setFileObj(file);
                } else {
                  setUploadedFile(null);
                  setFileObj(null);
                }
              }}
            />
          </label>
          <span className="text-xs text-gray-500 block mt-1">Apenas PNG ou JPG. Se for JPG, será convertido para PNG.</span>
          {uploadedFile && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-700">{uploadedFile}</span>
              <button
                type="button"
                className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                onClick={() => {
                  setUploadedFile(null);
                  setFileObj(null);
                  if (formRef.current) {
                    const fileInput = formRef.current.elements.namedItem('image_file') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }
                }}
              >
                Remover
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
