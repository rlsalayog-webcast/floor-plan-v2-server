export const typeDefs = `#graphql
    scalar JSON

    type Mutation {
        createLandmark(
            name: String!,
            category: String!,
            latitude: String!,
            longitude: String!
        ): Landmark

        deleteLandmark(
            id: ID!
        ): Landmark
        
        createFloor(
            landmarkId: ID!,
            level: String!,
            name: String!,
        ): Floor

        updateFloor(
            id: ID!
            landmarkId: ID!
            level: String!
            name: String!
        ): Floor!

        deleteFloor(
            id: ID!
            landmarkId: ID!
        ): Boolean!

        createArea(
            floorId: ID!,
            x: Float!,
            y: Float!,
            width: Float!,
            height: Float!,
            backgroundColor: String!,
            textColor: String!,
            details: JSON!
        ): FloorPlanArea

        updateFloorAreas(
            landmarkId: ID!
            floorId: ID!
            areas: [UpdateFloorPlanAreaInput!]!
        ): [FloorPlanArea]!
    }

    type Query {
        getLandmarks: [Landmark!]!
        getLandmarkById(id: ID!): Landmark
        getFloorByLevelId(landmarkId: ID!, levelId: String!): Floor
    }

    type FloorPlanAreaDetail {
        name: String!
        description: String!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlanArea {
        id: ID!
        x: Float!
        y: Float!
        pageNumber: Int!
        detail: FloorPlanAreaDetail!
        createdAt: String!
        updatedAt: String!
    }

    type FloorPlan {
        id: ID!
        pathname: String!
        floorId: ID!
        areas: [FloorPlanArea]
        createdAt: String!
        updatedAt: String!
    }


    type Floor {
        id: ID!
        level: String!
        name: String!
        landmarkId: ID!
        floorPlan: [FloorPlan]
        createdAt: String! 
        updatedAt: String!
    }

    type Landmark {
        id: ID!
        name: String!
        category: String!
        latitude: String!
        longitude: String!
        floor: [Floor]
        createdAt: String!
        updatedAt: String!
    }

    input UpdateAreaDetailsInput {
        name: String!
        description: String!
    }

    input UpdateFloorPlanAreaInput {
        id: ID
        x: Float!
        y: Float!
        pageNumber: Int!
        details: UpdateAreaDetailsInput!
    }
`;
