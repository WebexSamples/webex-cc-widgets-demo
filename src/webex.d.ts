declare module '@webex/cc-widgets' {
  interface Store {
    // Adding a generic store type since the exact shape is unknown
    [key: string]: any;
  }

  interface OutdialCall {
    // Adding a generic type since the exact shape is unknown
    [key: string]: any;
  }

  export const store: Store;
  export const OutdialCall: OutdialCall;
  export const StationLogin: React.ComponentType<any>;
  export const UserState: React.ComponentType<any>;
  export const IncomingTask: React.ComponentType<any>;
  export const TaskList: React.ComponentType<any>;
  export const CallControl: React.ComponentType<any>;
  export const CallControlCAD: React.ComponentType<any>;
}
