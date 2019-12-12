import { TruthTable } from "./TruthTable";
import { Variable } from "./Variable";
import { Entity } from "./Entity";
import { findMappings, PartialMapping } from "./mapping";
import { Sentence } from "./Sentence";

export class VariableTable extends TruthTable {
  readonly variables: Variable[];

  constructor(...variables:Variable[]) {
    super();
    this.variables = [];
    if(variables.length)
      this.addVariables(...variables)
  }

  addVariable(v:Variable) {
    if(!this.variables.includes(v))
      this.variables.push(v);
  }

  addVariables(...vars:Variable[]) {
    for(let v of vars) 
      this.addVariable(v);
  }

  get numberOfVariables() {
    return this.variables.length;
  }

  /** Create a new truth table by substituting the variables for a given list of entities. */
  substitute(...mapping:Entity[]) {
    if(mapping.length != this.numberOfVariables)
      throw "Attempting to substitute VariableTable with incorrect number of arguments."

    let newTable = this.clone();
    for(let i in this.variables)
      newTable.makeIdentical(mapping[i], this.variables[i], false);
    
    return newTable;
  }

  /** Compare a this table (under a given variable mapping) to another table, listing the differences or returning null (if none exist). */
  findMappingErrors(table:TruthTable, mapping:Entity[]) {
    const mapped = this.substitute(...mapping).facts;
    let errors = [];
    for(let {sentence, truth} of mapped) {
      if(table.lookUp(sentence) != truth)
        errors.push(sentence);
    }

    if(errors.length)
      return errors;
    else
      return null;
  }

  /** Quickly determine whether a mapping fits a sentence. */
  testMapping(table:TruthTable, mapping:Entity[]) {
    const mapped = this.substitute(...mapping).facts;
    for(let {sentence, truth} of mapped)
      if(table.lookUp(sentence) != truth)
        return false;

    return true;
  }

  findMappings(onto:TruthTable) {
    return findMappings(this, onto);
  }

  /** Represents the table as a string of logical symbols. */
  get symbol() {
    return `∃ (${this.variables.map(v => v.symbol).join(',')}) s.t. {` +
      this.facts
        .map(({sentence, truth}) => `(${sentence.symbol}=${truth})`)
        .join(' & ') 
      + '}';
  }

  merge(...tables:(TruthTable|VariableTable)[]) {
    for(let table of tables)
      if(table instanceof VariableTable)
        this.addVariables(...table.variables);
    
    TruthTable.prototype.merge.call(this, ...tables);
    return this;
  }

  /** Replace the variables using the given mapping. */
  implement(...mapping:Entity[]) {
    if(mapping.length != this.numberOfVariables)
      throw `Expected ${this.numberOfVariables} substitutions.`;

    let table = new TruthTable;
    for(let {sentence, truth} of this.iterate()) {
      let args = sentence.args.map(arg => {
        let i = this.variables.indexOf(arg);
        if(i == -1)
          return arg;
        else
          return mapping[i];
      })

      table.assign(new Sentence(sentence.predicate, ...args), truth);
    }

    return table
  }

  /** Replace the variables with new entities */
  spawn() {
    let mapping = this.variables.map(x => new Entity)
    return this.implement(...mapping)
  }

  implementPartialMapping(mapping:PartialMapping) {
    let complete = mapping.map(x => x ? x : new Entity)
    return this.implement(...complete);
  }
}