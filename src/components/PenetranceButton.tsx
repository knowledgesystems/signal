import classnames from 'classnames';
import pluralize from 'pluralize';
import React from 'react';
import { Button } from 'react-bootstrap';

import "./PenetranceButton.css";

export interface IPenetranceButtonProps {
  penetrance: string;
  title?: string;
  geneCount: number;
  variantCount: number;
  patientCount: number;
  // description: string;
  // onClick?: () => void;
  className?: string;
  active?: boolean;
  href?: string;
  disabled?: boolean;
}

export const PenetranceButton = (props: IPenetranceButtonProps) => {
  return (
    <Button
      variant="light"
      active={props.active}
      href={props.href}
      disabled={props.disabled}
      className={classnames(
        props.href ? "penetranceButtonLink" : "penetranceButton",
        props.className
      )}
    >
      <div className="penetranceName">
        <strong>{props.title ? props.title : props.penetrance}</strong>
      </div>
      <div className="geneCount">{`${props.geneCount} ${pluralize('Gene', props.geneCount)}`}</div>
      <div className="variantCount">{`${props.variantCount} ${pluralize('Unique variant', props.variantCount)}`}</div>
      <div className="patientCount">{`${props.patientCount} ${pluralize('Patient', props.patientCount)}`}</div>
    </Button>
  );
}
