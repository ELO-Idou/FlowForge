class WorkflowWebSocket {
  private socket: WebSocket | null = null;

  connect(url: string, token?: string) {
    const wsUrl = token ? `${url}?token=${token}` : url;
    this.socket = new WebSocket(wsUrl);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const workflowWebSocket = new WorkflowWebSocket();
