import StepLayout from "@/components/layout/StepLayout"
import RegistrationForm from "@/components/forms/RegistrationForm"

export default function PendaftaranPage() {
  return (
    <StepLayout title="Pendaftaran" subtitle="Lengkapi data siswa dan pilih paket belajar">
      <RegistrationForm />
    </StepLayout>
  )
}