/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCompressedComboBox,
  EuiComboBoxOptionOption,
  EuiCompressedFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCompressedFormRow,
  EuiPopover,
  EuiPopoverFooter,
  EuiPopoverTitle,
  EuiSpacer,
  htmlIdGenerator,
} from '@elastic/eui';
import producer from 'immer';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ACCELERATION_AGGREGRATION_FUNCTIONS } from '../../../../../common/constants';
import {
  AggregationFunctionType,
  CreateAccelerationForm,
  MaterializedViewColumn,
} from '../../../../../common/types';

interface AddColumnPopOverProps {
  isColumnPopOverOpen: boolean;
  setIsColumnPopOverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  columnExpressionValues: MaterializedViewColumn[];
  setColumnExpressionValues: React.Dispatch<React.SetStateAction<MaterializedViewColumn[]>>;
  accelerationFormData: CreateAccelerationForm;
  setAccelerationFormData: React.Dispatch<React.SetStateAction<CreateAccelerationForm>>;
}

export const AddColumnPopOver = ({
  isColumnPopOverOpen,
  setIsColumnPopOverOpen,
  columnExpressionValues,
  setColumnExpressionValues,
  accelerationFormData,
  setAccelerationFormData,
}: AddColumnPopOverProps) => {
  const [selectedFunction, setSelectedFunction] = useState([
    ACCELERATION_AGGREGRATION_FUNCTIONS[0],
  ]);
  const [selectedField, setSelectedField] = useState<EuiComboBoxOptionOption[]>([]);
  const [selectedAlias, setSeletedAlias] = useState('');

  const resetSelectedField = () => {
    if (accelerationFormData.dataTableFields.length > 0) {
      const defaultFieldName = accelerationFormData.dataTableFields[0].fieldName;
      setSelectedField([{ label: defaultFieldName }]);
    }
  };

  const resetValues = () => {
    setSelectedFunction([ACCELERATION_AGGREGRATION_FUNCTIONS[0]]);
    resetSelectedField();
    setSeletedAlias('');
  };

  const onChangeAlias = (e: ChangeEvent<HTMLInputElement>) => {
    setSeletedAlias(e.target.value);
  };

  const onAddExpression = () => {
    const newColumnExpresionValue = [
      ...columnExpressionValues,
      {
        id: htmlIdGenerator()(),
        functionName: selectedFunction[0].label as AggregationFunctionType,
        functionParam: selectedField[0].label,
        fieldAlias: selectedAlias,
      },
    ];

    setAccelerationFormData(
      producer((accData) => {
        accData.materializedViewQueryData.columnsValues = newColumnExpresionValue;
      })
    );

    setColumnExpressionValues(newColumnExpresionValue);
    setIsColumnPopOverOpen(false);
  };

  useEffect(() => {
    resetSelectedField();
  }, []);

  return (
    <EuiPopover
      panelPaddingSize="s"
      button={
        <EuiButtonEmpty
          iconType="plusInCircle"
          aria-label="add column"
          onClick={() => {
            resetValues();
            setIsColumnPopOverOpen(!isColumnPopOverOpen);
          }}
          size="xs"
        >
          Add Column
        </EuiButtonEmpty>
      }
      isOpen={isColumnPopOverOpen}
      closePopover={() => setIsColumnPopOverOpen(false)}
    >
      <EuiPopoverTitle>Add Column</EuiPopoverTitle>
      <>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiCompressedFormRow label="Aggregate function">
              <EuiCompressedComboBox
                singleSelection={{ asPlainText: true }}
                options={ACCELERATION_AGGREGRATION_FUNCTIONS}
                selectedOptions={selectedFunction}
                onChange={setSelectedFunction}
                isClearable={false}
              />
            </EuiCompressedFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCompressedFormRow label="Aggregation field">
              <EuiCompressedComboBox
                singleSelection={{ asPlainText: true }}
                options={[
                  { label: '*', disabled: selectedFunction[0].label !== 'count' },
                  ...accelerationFormData.dataTableFields.map((x) => ({ label: x.fieldName })),
                ]}
                selectedOptions={selectedField}
                onChange={setSelectedField}
                isClearable={false}
              />
            </EuiCompressedFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="m" />
        <EuiCompressedFormRow label="Column alias - optional">
          <EuiCompressedFieldText name="aliasField" onChange={onChangeAlias} />
        </EuiCompressedFormRow>
      </>
      <EuiPopoverFooter>
        <EuiButton size="s" fill onClick={onAddExpression}>
          Add
        </EuiButton>
      </EuiPopoverFooter>
    </EuiPopover>
  );
};
