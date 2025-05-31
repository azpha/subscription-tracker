import Modal from "./Modal";
import SubscriptionForm from "./SubscriptionForm";
import InfoModal from "./InfoModal";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { closeActiveModal } from "../../store/reducers/modalSlice";
import { updateEditingItem } from "../../store/reducers/itemSlice";

export default function ModalContainer() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.modals.activeModal);
  const editingSubscription = useAppSelector((state) => state.item.editingItem);

  if (activeModal === "editing") {
    return (
      <Modal
        onClose={() => {
          dispatch(closeActiveModal());
          dispatch(updateEditingItem(null));
        }}
      >
        <SubscriptionForm subscription={editingSubscription} />
      </Modal>
    );
  } else if (activeModal === "info") {
    return (
      <Modal onClose={() => dispatch(closeActiveModal())}>
        <InfoModal />
      </Modal>
    );
  }
}
