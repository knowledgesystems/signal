import mockMutations from './mock.json';


class MutationStore
{
    public get mutations() {
        // TODO read data from file or get it from a service
        return mockMutations;
    }
}

export default MutationStore;
