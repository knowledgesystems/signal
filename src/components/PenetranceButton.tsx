import classnames from 'classnames';
import pluralize from 'pluralize';
import React from 'react';
import { Button } from 'react-bootstrap';

import {PenetranceLevel} from "../model/Penetrance";
import "./PenetranceButton.css";

export interface IPenetranceButtonProps {
  penetrance: PenetranceLevel;
  title?: string;
  geneCount?: number;
  variantCount?: number;
  patientCount?: number;
  // description: string;
  onClick?: (penetrance?: string) => void;
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
      onClick={props.onClick ? () => props.onClick!(): undefined}
      disabled={props.disabled}
      className={classnames("penetranceButton", props.className)}
    >
      <div className="penetranceName">
        <strong>{props.title ? props.title : props.penetrance}</strong>
      </div>
      {props.geneCount !== undefined &&
        <div className="geneCount">{`${props.geneCount} ${pluralize('Gene', props.geneCount)}`}</div>
      }
      {props.variantCount !== undefined &&
        <div className="variantCount">{`${props.variantCount} ${pluralize('Unique variant', props.variantCount)}`}</div>
      }
      {props.patientCount !== undefined &&
        <div className="patientCount">{`${props.patientCount} ${pluralize('Patient', props.patientCount)}`}</div>
      }
    </Button>
  );
}
