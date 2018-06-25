/**
 * Custom Schema words
 * @type {{ordersSortedBy: {type: string, errors: boolean, validate: module.exports.ordersSortedBy.validate}}}
 */
module.exports = {
  ordersSortedBy: {
    type: 'array',
    errors: true,
    validate: function validate(sch, data) {
      const key = sch[0];
      const direction = sch[1];
      validate.errors = [{
        keyword: 'ordersSortedBy',
        message: 'orders list is not sorted',
        params: { keyword: 'ordersSortedBy', sortingKey: key, direction },
      }];
      if (direction === 'asc' || direction === 'desc') {
        const defaultSort = {};
        data.forEach((el) => {
          if (!defaultSort[el.category]) defaultSort[el.category] = {};
          defaultSort[el.category][el._embedded.position] = el[key];
        });
        return Object.keys(defaultSort).every((category) => {
          const sorted = [];
          for (let i = 0; i < Object.keys(defaultSort[category]).length; i += 1) {
            sorted.push(defaultSort[category][i]);
          }
          const expected = sorted.slice();
          if (typeof sorted[0] === 'string') {
            if (direction === 'desc') {
              expected.sort().reverse();
            } else {
              expected.sort();
            }
          } else if (typeof sorted[0] === 'number') {
            if (direction === 'desc') {
              expected.sort((a, b) => b - a);
            } else {
              expected.sort((a, b) => a - b);
            }
          }
          return (expected.length === sorted.length) &&
            sorted.every((element, index) => element === expected[index]);
        });
      }
      validate.errors = [{
        keyword: 'ordersSortedBy',
        message: 'wrong direction type',
        params: { keyword: 'ordersSortedBy', sortingKey: key, direction },
      }];
      return false;
    },
  },
};
