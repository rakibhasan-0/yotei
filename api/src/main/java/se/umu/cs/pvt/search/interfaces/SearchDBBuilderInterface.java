package se.umu.cs.pvt.search.interfaces;

import se.umu.cs.pvt.search.DatabaseQuery;

/**
 * The interface required for all DB query builders.
 *
 * @author Minotaur (James Eriksson)
 */

public interface SearchDBBuilderInterface {
    DatabaseQuery build();
}
