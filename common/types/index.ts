/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export type AggregationFunctionType = 'count' | 'sum' | 'avg' | 'max' | 'min';

export interface MaterializedViewColumn {
  id: string;
  functionName: AggregationFunctionType;
  functionParam: string;
  fieldAlias?: string;
}

export type SkippingIndexAccMethodType = 'PARTITION' | 'VALUE_SET' | 'MIN_MAX';

export interface SkippingIndexRowType {
  id: string;
  fieldName: string;
  dataType: string;
  accelerationMethod: SkippingIndexAccMethodType;
}

export interface DataTableFieldsType {
  id: string;
  fieldName: string;
  dataType: string;
}

export interface RefreshIntervalType {
  refreshWindow: number;
  refreshInterval: string;
}

export interface WatermarkDelayType {
  delayWindow: number;
  delayInterval: string;
}

export type AccelerationIndexType = 'skipping' | 'covering' | 'materialized';

export interface GroupByTumbleType {
  timeField: string;
  tumbleWindow: number;
  tumbleInterval: string;
}

export interface MaterializedViewQueryType {
  columnsValues: MaterializedViewColumn[];
  groupByTumbleValue: GroupByTumbleType;
}

export interface FormErrorsType {
  dataSourceError: string[];
  databaseError: string[];
  dataTableError: string[];
  skippingIndexError: string[];
  coveringIndexError: string[];
  materializedViewError: string[];
  indexNameError: string[];
  primaryShardsError: string[];
  replicaShardsError: string[];
  refreshIntervalError: string[];
  checkpointLocationError: string[];
  watermarkDelayError: string[];
}

export type AccelerationRefreshType = 'auto' | 'interval' | 'manual';

export interface CreateAccelerationForm {
  dataSource: string;
  database: string;
  dataTable: string;
  dataTableFields: DataTableFieldsType[];
  accelerationIndexType: AccelerationIndexType;
  skippingIndexQueryData: SkippingIndexRowType[];
  coveringIndexQueryData: string[];
  materializedViewQueryData: MaterializedViewQueryType;
  accelerationIndexName: string;
  primaryShardsCount: number;
  replicaShardsCount: number;
  refreshType: AccelerationRefreshType;
  checkpointLocation: string | undefined;
  watermarkDelay: WatermarkDelayType;
  refreshIntervalOptions: RefreshIntervalType;
  formErrors: FormErrorsType;
}

export enum AsyncQueryStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
  Running = 'running',
  Scheduled = 'scheduled',
  Cancelled = 'cancelled',
  Waiting = 'waiting',
}

export enum CachedDataSourceStatus {
  Updated = 'Updated',
  Failed = 'Failed',
  Empty = 'Empty',
}

export type TreeItemType =
  | 'covering_index'
  | 'skipping_index'
  | 'table'
  | 'database'
  | 'materialized_view'
  | 'Load Materialized View'
  | 'badge';

export interface TreeItem {
  name: string;
  type: TreeItemType;
  isExpanded: boolean;
  values?: TreeItem[];
  isLoading?: boolean;
}

export interface DatasourceTreeLoading {
  flag: boolean;
  status: string;
}

interface AsyncApiDataResponse {
  status: string;
  schema?: Array<{ name: string; type: string }>;
  datarows?: any;
  total?: number;
  size?: number;
  error?: string;
}

export interface AsyncApiResponse {
  data: {
    ok: boolean;
    resp: AsyncApiDataResponse;
  };
}

export interface RenderAccelerationFlyoutProps {
  dataSource: string;
  dataSourceMDSId?: string;
  databaseName?: string;
  tableName?: string;
  handleRefresh?: () => void;
}

export type PollingCallback = (statusObj: AsyncApiResponse) => void;
