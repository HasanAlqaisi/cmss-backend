const stages = new Map<number, string>();
stages.set(1, "First");
stages.set(2, "Second");
stages.set(3, "Third");
stages.set(4, "Fourth");

export default (stageNumber: number): string | undefined => stages.get(stageNumber);
