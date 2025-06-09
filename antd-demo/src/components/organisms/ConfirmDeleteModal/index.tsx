import React from "react";
import { Modal } from "antd";

interface ConfirmDeleteModalProps {
  visible: boolean;
  itemName: string;
  itemId: string;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  entityType?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  itemName,
  itemId,
  onConfirm,
  onCancel,
  entityType = "Item",
}) => {
  const handleOk = () => {
    onConfirm(itemId);
  };

  return (
    <Modal
      title={`Delete ${entityType}`}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
      centered
    >
      <p>
        Are you sure you want to delete this {entityType.toLowerCase()}? This
        action cannot be undone.
      </p>
      <p>
        <strong>{entityType}:</strong> {itemName}
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;
