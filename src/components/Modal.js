import cx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

import s0 from './Modal.module.css';

function ModalAPIConfig({
  isOpen,
  onRequestClose,
  className,
  overlayClassName,
  children,
  ...otherProps
}) {
  const contentCls = cx(className, s0.content);
  const overlayCls = cx(overlayClassName, s0.overlay);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={contentCls}
      overlayClassName={overlayCls}
      {...otherProps}
    >
      {children}
    </Modal>
  );
}

ModalAPIConfig.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  overlayClassName: PropTypes.string
};

export default React.memo(ModalAPIConfig);
