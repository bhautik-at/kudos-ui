import { CreateKudoButton } from './CreateKudoButton';
import { CreateKudoModal } from './CreateKudoModal';
import { useKudoForm } from '../hooks/useKudoForm';

interface KudoCreatorProps {
  organizationId: string;
}

export const KudoCreator = ({ organizationId }: KudoCreatorProps) => {
  const { isModalOpen, openModal, closeModal, handleSubmit } = useKudoForm(organizationId);

  return (
    <>
      <CreateKudoButton onClick={openModal} />
      <CreateKudoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        organizationId={organizationId}
      />
    </>
  );
};
