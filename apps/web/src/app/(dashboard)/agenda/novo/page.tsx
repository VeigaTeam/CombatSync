import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewAppointmentContent } from './new-appointment-content';

export const metadata: Metadata = { title: 'Novo Agendamento' };

export default function NewAppointmentPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Novo Agendamento</CardTitle>
          <CardDescription>
            Preencha os dados para criar um novo agendamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewAppointmentContent />
        </CardContent>
      </Card>
    </div>
  );
}
