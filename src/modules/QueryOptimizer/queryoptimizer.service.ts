/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { GraphQLResolveInfo, Kind, SelectionNode } from 'graphql';

type TypeormOptmization = {
  select: Record<string, boolean | Record<string, boolean>>;
  relations: string[];
};
@Injectable()
export class QueryOptimizerService {
  paginateFields = ['meta', 'totalCount', 'totalPages', 'page', 'limit', 'items'];

  private extractRequestedFields(info: GraphQLResolveInfo): TypeormOptmization {
    const relatedFieldsNames: string[] = [];

    if (!info || !info.fieldNodes[0]?.selectionSet?.selections) {
      return {} as TypeormOptmization;
    }

    const processSelections = (selections: readonly SelectionNode[]) => {
      const result: Record<string, boolean | Record<string, boolean>> = {};

      for (const selection of selections) {
        if (selection.kind !== Kind.FIELD) continue;

        const fieldName = selection.name.value;

        if (fieldName === '__typename') continue;

        if (this.paginateFields.includes(fieldName)) {
          if (selection.selectionSet) {
            Object.assign(result, processSelections(selection.selectionSet.selections));
          }
          continue;
        }

        if (!selection.selectionSet) {
          result[fieldName] = true;
          continue;
        }
        relatedFieldsNames.push(fieldName);

        result[fieldName] = processSelections(selection.selectionSet.selections) as Record<
          string,
          boolean
        >;
      }

      return result;
    };

    return {
      select: processSelections(info.fieldNodes[0].selectionSet.selections),
      relations: relatedFieldsNames,
    };
  }

  public generateOptimization(info?: GraphQLResolveInfo): TypeormOptmization | undefined {
    if (!info) return undefined;
    return this.extractRequestedFields(info);
  }
}
