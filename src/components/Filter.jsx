import { Button, Input } from "@chakra-ui/react";

export default function Filter({
  searchValue,
  setSearchValue,
  setSearchParams,
}) {
  return (
    <div>
      <div className="filter-container">
        <label>
          <Input
            type="search"
            placeholder="Search for Events"
            mt="2rem"
            mb="2rem"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </label>
      </div>
      <div className="filter-buttons">
        {[
          { label: "All", categoryIds: [] },
          { label: "Sports", categoryIds: [1] },
          { label: "Games", categoryIds: [2] },
          { label: "Relaxation", categoryIds: [3] },
          { label: "Concerts", categoryIds: [4] },
        ].map(({ label, categoryIds }) => (
          <Button
            key={label}
            colorScheme={
              label === "All"
                ? "yellow"
                : label === "Sports"
                ? "red"
                : label === "Games"
                ? "blue"
                : label === "Relaxation"
                ? "green"
                : "purple"
            }
            variant="outline"
            m=".2rem"
            onClick={() => setSearchParams({ categoryIds })}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
