import * as _ from 'underscore'

export function setVal(val: any, _else: any): any {
  if (_.isUndefined(val)) {
    return _else
  }
  return val
}

export function checkActionInterface(microserviceJson: any): void {
  if (microserviceJson.actions) {
    const actionMap = microserviceJson.actions
    for (const actionName of Object.keys(actionMap)) {
      const action = actionMap[actionName]
      const bools = [
        !!action.http,
        !!action.format,
        !!action.rpc,
        !!action.events
      ].filter(b => b)
      if (bools.length !== 1) {
        throw {
          text: `actions.${actionName} should have one of required property: 'http' 'format' 'rpc' or 'events'`
        }
      }
    }
  }
}

export function log(string) {
  process.stdout.write(`${string}\n`)
}

export function error(string) {
  process.stderr.write(`${string}\n`)
}
