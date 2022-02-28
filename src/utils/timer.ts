export class Timer {
  private readonly start = performance.now();

  public elapsed = () => {
    return parseFloat((performance.now() - this.start).toFixed(2));
  };
}
