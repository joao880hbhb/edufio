import StepLayout from "@/components/layout/StepLayout"
import RegistrationForm from "@/components/forms/RegistrationForm"

export default function PendaftaranPage() {
  return (
    <StepLayout step={1} title="Pendaftaran" subtitle="data paket les">
      <RegistrationForm />
    </StepLayout>
  )
}