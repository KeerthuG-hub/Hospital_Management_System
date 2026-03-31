import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  itemName,
  itemType = 'record',
  onConfirm
}) {
  const handleClose = () => setShowDeleteModal(false);

  return (
    <>
      <Modal show={showDeleteModal} onHide={handleClose} backdrop='static' keyboard={false} centered>
        <Modal.Header closeButton style={{ background: '#fff3f3', borderBottom: '1px solid #ffcdd2' }}>
          <Modal.Title style={{ color: '#c62828', fontSize: '1.1rem', fontWeight: 600 }}>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          Are you sure you want to delete <strong>{itemName}</strong>? This {itemType} action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleClose}>Cancel</Button>
          <Button variant='danger' onClick={onConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;
